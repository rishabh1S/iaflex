import { Text, Image, YStack, XStack, Label, Avatar } from "tamagui";
import React, { useEffect, useState } from "react";
import { Dimensions, Pressable } from "react-native";
import { FontAwesome } from "@expo/vector-icons";
import ImageView from "react-native-image-viewing";
import { GestureHandlerRootView } from "react-native-gesture-handler";
import { useLocalSearchParams } from "expo-router";
import { fetchPostById } from "@/api";
import { formatDistanceToNow, parseISO } from "date-fns";
import { handleDownload, handleShare } from "../utils/utilityFunctions";
import ImageViewFooter from "./ImageViewFooter";

const width = Dimensions.get("window").width;

const Post = () => {
  const { id } = useLocalSearchParams<{
    id: string;
  }>();
  const [post, setPost] = useState<any>();
  const [isImageViewVisible, setImageViewVisible] = useState(false);
  const [showMore, setShowMore] = useState(false);
  const maxLines = showMore ? undefined : 1;

  const image = {
    uri: post?.imageURL,
  };

  useEffect(() => {
    const getPostDetails = async () => {
      try {
        const postData = await fetchPostById(id);
        setPost(postData.data);
      } catch (error) {
        console.error("Error fetching post details:", error);
      }
    };

    getPostDetails();
  }, [id]);

  useEffect(() => {
    setShowMore(false);
  }, []);

  return (
    <YStack>
      <XStack
        gap="$4"
        marginHorizontal="$3"
        paddingVertical="$2.5"
        alignItems="center"
      >
        <Avatar circular>
          <Avatar.Image accessibilityLabel="Cam" src={post?.userAvatar} />
          <Avatar.Fallback backgroundColor="$red10" />
        </Avatar>
        <Label fontSize="$5">{post?.username}</Label>
      </XStack>
      <GestureHandlerRootView>
        <Pressable onPress={() => setImageViewVisible(true)}>
          <Image
            source={{
              uri: post?.imageURL,
              width: width,
              height: width,
            }}
          />
        </Pressable>
      </GestureHandlerRootView>
      <XStack marginHorizontal="$2.5" paddingVertical="$2">
        <YStack>
          <Text fontSize="$3" numberOfLines={maxLines} width={width * 0.85}>
            {post?.prompt}
          </Text>
          {!showMore && post?.prompt.length > 55 && (
            <Text
              onPress={() => setShowMore(true)}
              fontSize="$3"
              color="$color10"
            >
              more
            </Text>
          )}
          <Text fontSize="$2" color="$gray9" marginTop="$1.5">
            {post
              ? formatDistanceToNow(parseISO(post.createdAt), {
                  addSuffix: true,
                }).replace(/^about\s/, "")
              : ""}
          </Text>
        </YStack>
        <XStack marginLeft="auto">
          <FontAwesome name="magic" size={24} color="white" />
        </XStack>
      </XStack>
      <ImageView
        images={[image]}
        imageIndex={0}
        visible={isImageViewVisible}
        onRequestClose={() => setImageViewVisible(false)}
        FooterComponent={() => (
          <ImageViewFooter
            onDownload={() => handleDownload(post?.imageURL)}
            onShare={() => handleShare(post?.imageURL)}
          />
        )}
      />
    </YStack>
  );
};

export default Post;
